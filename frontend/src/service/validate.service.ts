export interface IValidate {
    property: string;
    constraints: {
        [type: string]: string;
    };
}