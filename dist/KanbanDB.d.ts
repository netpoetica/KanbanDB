declare var _default: KanbanDB;
export default _default;
export type Card = {
    name?: string | undefined;
    description?: string | undefined;
    status?: CARD_STATUS | undefined;
    created?: Date | undefined;
    lastUpdated?: Date | undefined;
};
export type CARD_STATUS = "TODO" | "DOING" | "DONE";
/**
 * @typedef Card
 * @type {object}
 * @property {string=} name
 * @property {string=} description
 * @property {CARD_STATUS=} status
 * @property {Date=} created
 * @property {Date=} lastUpdated
 */
/**
 * @returns {KanbanDB}
 */
declare function KanbanDB(): KanbanDB;
declare class KanbanDB {
    /**
     * @returns {Promise<Card>} A single card, if found.
     */
    getCardById: (strId: any) => Promise<Card>;
    /**
     * @param {string} id Card ID
     * @param {Card} cardData Card data
     * @returns {Promise<boolean>} true if succesful.
     */
    updateCardById: (strId: any, cardData: Card) => Promise<boolean>;
    /**
     * @param {string} id Card ID
     * @returns {Promise<boolean>} true if succesful.
     */
    deleteCardById: (strId: any) => Promise<boolean>;
    /**
     * @returns {Promise<Card[]>} An array of all cards in the database.
     */
    getCards: () => Promise<Card[]>;
    /**
     * @param {CARD_STATUS[]} arrStatusCodes An array of valid status codes.
     * @returns {Promise<Card[]>} An array of all cards with specific status codes.
     */
    getCardsByStatusCodes: (arrStatusCodes: CARD_STATUS[]) => Promise<Card[]>;
    /**
     * @param {Card} cardData Card data
     * @returns {Promise<string>} A unique ID for the user to recall card again later.
     */
    addCard: (cardData: Card) => Promise<string>;
    /**
     * @param {string} previousInstanceId If you want to persist data across instantation, pass
     * the instance ID from a previous instantiation. Otherwise, every time you instantiate, you
     * will have a fresh database.
     * @returns {Promise<KanbanDB>} A handle to the KanbanDB instance.
     */
    connect: (previousInstanceId?: string) => Promise<KanbanDB>;
    /**
     * @returns {string} Current database instance ID, which can later
     * be passed to .connect(instanceID) to keep your data alive in local
     * storage.
     */
    getInstanceId: () => string;
    disconnect: () => Promise<any>;
}
declare namespace CARD_STATUS {
    const TODO: string;
    const DOING: string;
    const DONE: string;
}
