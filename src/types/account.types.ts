export enum RecordTypeEnums {
  Local = 'local',
  LDAP = 'LDAP',
}

export interface TagsInterface {
  text: string
} 

interface BaseAccountInterface {
  id: number
  tags: Array<TagsInterface>
  login: string
  createdAt?: Date
}

export interface LocalAccountInterface extends BaseAccountInterface {
  recordType: RecordTypeEnums.Local
  password: string
}

export interface LDAPAccountInterface extends BaseAccountInterface {
  recordType: RecordTypeEnums.LDAP
}

export type AccountInterface = LocalAccountInterface | LDAPAccountInterface

export interface AccountsStoreInterface {
  accounts: AccountInterface[]
  createAccount: (account: AccountInterface) => void
  deleteAccount: (accountId: number) => AccountInterface | null
}