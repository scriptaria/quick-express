export interface RefreshToken {
    refresh: string;
    refreshExpires: Date;
}

export interface AccessToken {
    access: string;
    accessExpires: Date;
}

export interface Auth {
    access: string;
    accessExpires: Date;
    refresh: string;
    refreshExpires: Date;
}
