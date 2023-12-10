export interface SelectOption {
    id: number;
    value: number;
    label: string;
    active: boolean;
    description: string;
}

export interface DirtySelectOption {
    id: any;
    value: any;
    label: any;
    active: any;
    description: any;
}