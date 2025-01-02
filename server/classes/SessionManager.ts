export class SessionManager{
    private static _instance: SessionManager;
    private _sessionIds: string[] = [];

    public constructor() {
        if (SessionManager._instance) {
            return SessionManager._instance;
        }

        SessionManager._instance = this;
    }

    /**
     * Get saved session IDs.
     */
    public get(): string[] {
        return this._sessionIds;
    }

    /**
     * Check if the session ID is valid.
     */
    public check(sessionId: string): boolean {
        return this._sessionIds.includes(sessionId);
    }

    /**
     * Create a random unique session ID that is used to identify
     * the user in the WebSocket server(24 characters long).
     */
    public create(): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let id = '';

        for (let i = 0; i < 24; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            id += characters.charAt(randomIndex);
        }

        if(this._sessionIds.includes(id))
            return this.create();

        this._sessionIds.push(id);
        return id;
    }

    /**
     * Remove session ID.
     */
    public remove(sessionId: string): void {
        this._sessionIds = this._sessionIds.filter(id => id !== sessionId);
    }

    /**
     * Remove all session IDs.
     */
    public clear(): void {
        this._sessionIds = [];
    }
}
