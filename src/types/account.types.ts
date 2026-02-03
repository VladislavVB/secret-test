
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
}

interface LocalAccountInterface extends BaseAccountInterface {
  recordType: RecordTypeEnums.Local
  password: string
}

interface LDAPAccountInterface extends BaseAccountInterface {
  recordType: RecordTypeEnums.LDAP
  password: null
}
export type AccountInterface = LocalAccountInterface | LDAPAccountInterface

export type AccountValidationField = 'tags' | 'login' | 'password'
export type AccountValidationErrors = Partial<Record<AccountValidationField, string>>