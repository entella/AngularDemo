export class Common {
}

export class KeyValueModel{
    key: number;
    Value : string;
    isSelected : boolean = false;
    parentId: number = null;

    constructor(key : number = 0, value: string = '' , isSelected : boolean = false, parentId :number = 0)
    {
      this.key = key,
      this.Value = value,
      this.isSelected = isSelected,
      this.parentId = parentId;
    }
  }