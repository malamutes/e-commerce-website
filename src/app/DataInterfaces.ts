interface AddressInterface {
    firstName: string;
    lastName: string;
    phone: string;
    addressName: string;
    addressLineOne: string;
    addressLineTwo?: string; // Optional as it may not always be provided
    country: string;
    stateProvince: string;
    city: string;
    zipCode: string;
}

interface DBAddressInterface { [key: string]: AddressInterface };

export type { AddressInterface, DBAddressInterface };