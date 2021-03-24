export interface Message{
    id: number;
    senderId: number;
    senderUsername: string;
    senderPhotoUrl: string;
    recipientId: number;
    recipientUsername: string;
    recipientPhotoUrl: string;
    coontent: string;
    dateRead?: Date;
    messageSent: Date;
}