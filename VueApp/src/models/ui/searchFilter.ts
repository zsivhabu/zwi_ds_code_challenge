export interface SearchFilter {
    notificationNumber: string;
    referenceNumber: string;
    directorate: string;
    branch: string;
    department: string;
    causeCode: string;
    causeCodeGroup: string;
    code: string;
    hexId: string;
    officialSuburb: string;
    section: string;

    latitude: number;
    longitude: number;
    radius: number;

    creation_start_date: string;
    creation_end_date: string;
    completion_start_date: string;
    completion_end_date: string;

    page_size: number;
    page_number: number;
}