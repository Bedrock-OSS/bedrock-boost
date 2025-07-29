import { world } from '@minecraft/server';
import { install as playerInstall } from './PlayerPolyfill';

export default class Polyfill {
    private static _installed: Map<string, boolean> = new Map<
        string,
        boolean
    >();
    /**
     * Installs the polyfill for the console.
     *
     * This polyfill makes `console.log` send a message to the world chat.
     */
    public static installConsole(): void {
        if (this._installed.get('console')) return;
        this._installed.set('console', true);
        (console as any).originalLog = console.log;
        console.log = (...args: any[]) => {
            (console as any).originalLog(...args);
            const message = args.join(' ');
            world.sendMessage(message);
        };
    }
    /**
     * Installs the polyfill for the player.
     *
     * This polyfill adds the following methods to the player:
     * - applyImpulse
     * - clearVelocity
     */
    public static installPlayer(): void {
        if (this._installed.get('player')) return;
        this._installed.set('player', true);
        playerInstall();
    }
}
