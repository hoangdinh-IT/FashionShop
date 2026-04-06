export interface User {
    id: string;
    email: string;
    role: RoleUser;
    fullName: string;
    phoneNumber: string;
    gender: Gender;
    dateOfBirth: Date;
    avatarUrl: string;
    membershipClass: MembershipClass;
}

export const RoleUser = {
    Admin: "Admin",
    Customer: "Customer",
} as const;

export type RoleUser = typeof RoleUser[keyof typeof RoleUser];

export const Gender = {
    Other: "Other",
    Male: "Male",
    Female: "Female",
} as const;

export type Gender = typeof Gender[keyof typeof Gender];

export const MembershipClass = {
    New: "New",
    Bronze: "Bronze",
    Silver: "Silver",
    Gold: "Gold",
    Diamond: "Diamond",
} as const;

export type MembershipClass = typeof MembershipClass[keyof typeof MembershipClass];