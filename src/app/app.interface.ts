export interface SavedGames {
    game: string;
    name: string;
    dateStarted?: Date;
    dateUpdated?: Date;
}


export interface GameDataItems {
    name: string;
    description: string;
    value: { [key: string]: any };
}

export interface GameData {
    category: string;
    description: string;
    progress: number;
    fields: { [key: string]: "checkbox" };
    items: GameDataItems[];
}

