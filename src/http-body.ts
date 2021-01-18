
export class HttpBody {
    constructor(
        readonly contentType: string,
        readonly content: () => BodyInit
    ) { }

    static json(data: any): HttpBody {
        return new HttpBody("application/json", () => JSON.stringify(data));
    }
}