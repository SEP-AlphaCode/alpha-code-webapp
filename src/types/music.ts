import { ActionActivites } from "./action";

// Audio conversion API types
export type AudioConvertRequest = {
    file: File;
    start_time?: number;
    end_time?: number;
}

export type AudioConvertResponse = {
    message: string;
    file_name: string;
    url: string;
    duration: number;
    trimming_applied?: {
        start_time: number;
        end_time: number;
    };
}

export type MusicInfor ={
    name: string;
    music_file_url: string;
    duration: number;
    start_time: number;
    end_time: number;   
}

export type DancePlanReposnse = {
    music_info: MusicInfor;
    activity : {
        actions: ActionActivites[]; // Add the action
    }
}