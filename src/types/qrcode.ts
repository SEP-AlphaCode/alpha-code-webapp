export type QRCodeRequest = {
    name: string;
    qrCode: string;
    status: 'active' | 'inactive' | 'pending';
    activityId: string;
}

export type QRCodeResponse = {
    id: string,
    name: string,
    qrCode: string,
    status: number,
    createdDate: string,
    lastEdited: string,
    imageUrl: string,
    activityName: string,
    activityId: string
}
