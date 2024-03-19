export class CreateCardDto {
    readonly word: string;
    readonly translation: string;
    readonly example: string;
    readonly category: string;
    readonly difficulty: number;
    readonly isFront: boolean;

}