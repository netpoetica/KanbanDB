declare var _default: KanbanDB;
export default _default;
/**
 *
 * @returns {string} Returns the instance ID if you want to reuse across instatiations.
 */
declare function KanbanDB(): string;
declare class KanbanDB {
    /**
     * @returns {Promise<Card>} A single card, if found.
     */
    getCardById: (strId: any) => Promise<any>;
    /**
     * @returns {Promise<boolean>} true if succesful.
     */
    updateCardById: (strId: any, cardData: any) => Promise<boolean>;
    /**
     * @returns {Promise<boolean>} true if succesful.
     */
    deleteCardById: (strId: any) => Promise<boolean>;
    /**
     * @returns {Promise<Card[]>} An array of all cards in the database.
     */
    getCards: () => Promise<any[]>;
    /**
     * @param {string[]} arrStatusCodes An array of valid status codes.
     * @returns {Promise<Card[]>} An array of all cards with specific status codes.
     */
    getCardsByStatusCodes: (arrStatusCodes: string[]) => Promise<any[]>;
    /**
     * @returns {Promise<string>} A unique ID for the user to recall card again later.
     */
    addCard: (cardData: any) => Promise<string>;
    /**
     * @param {string} previousInstanceId If you want to persist data across instantation, pass
     * the instance ID from a previous instantiation. Otherwise, every time you instantiate, you
     * will have a fresh database.
     * @returns {Promise} A handle to the KanbanDB instance.
     */
    connect: (previousInstanceId: string) => Promise<any>;
    disconnect: () => Promise<any>;
}
