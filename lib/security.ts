const SECRET_KEY = process.env.SESSION_SECRET || 'super-secret-key-change-this-in-prod';

function getEncoder() {
    return new TextEncoder();
}

function bufferToHex(buffer: ArrayBuffer | ArrayBufferView): string {
    const uint8Arr = buffer instanceof Uint8Array
        ? buffer
        : new Uint8Array(buffer instanceof ArrayBuffer ? buffer : (buffer as any).buffer);

    return Array.from(uint8Arr)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

function hexToUint8Array(hexString: string): Uint8Array {
    const matches = hexString.match(/.{1,2}/g);
    if (!matches) return new Uint8Array(0);
    return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
}

export async function hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        getEncoder().encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );
    const hashBuffer = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: 1000,
            hash: "SHA-512"
        },
        keyMaterial,
        64 * 8 // 512 bits
    );

    return {
        hash: bufferToHex(hashBuffer),
        salt: bufferToHex(salt)
    };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const saltBuffer = hexToUint8Array(salt);
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        getEncoder().encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits"]
    );
    const verifyHashBuffer = await crypto.subtle.deriveBits(
        {
            name: "PBKDF2",
            salt: saltBuffer as BufferSource,
            iterations: 1000,
            hash: "SHA-512"
        },
        keyMaterial,
        64 * 8
    );
    const verifyHash = bufferToHex(verifyHashBuffer);

    return verifyHash === hash;
}

export async function signSession(payload: string): Promise<string> {
    const key = await crypto.subtle.importKey(
        "raw",
        getEncoder().encode(SECRET_KEY),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );
    const signatureBuffer = await crypto.subtle.sign(
        "HMAC",
        key,
        getEncoder().encode(payload)
    );
    const signature = bufferToHex(signatureBuffer);
    return `${payload}.${signature}`;
}

export async function verifySession(token: string): Promise<string | null> {
    const [payload, signature] = token.split('.');
    if (!payload || !signature) return null;

    try {
        const key = await crypto.subtle.importKey(
            "raw",
            getEncoder().encode(SECRET_KEY),
            { name: "HMAC", hash: "SHA-256" },
            false,
            ["verify"]
        );

        const signatureBytes = hexToUint8Array(signature);
        const dataBytes = getEncoder().encode(payload);

        const isValid = await crypto.subtle.verify(
            "HMAC",
            key,
            signatureBytes as BufferSource,
            dataBytes
        );

        if (isValid) {
            return payload;
        }
    } catch (e) {
        console.error("Session verification failed", e);
        return null;
    }
    return null;
}
