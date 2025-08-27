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
    lastEdited: string | null,
    imageUrl: string,
    activityId: string,
    activityName: string,
    accountId: string
}
