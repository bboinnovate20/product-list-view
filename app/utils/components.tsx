import { Category } from "./product";

export function SelectionGroup({label, value, data, onChange}: {label: string, name: string, 
    onChange: (data: string | number) => void, data: Category[], value?: number}) {


  return (
    <>
      <div className='w-full my-5 text-black'>
        <p className='text-sm'>{label}</p>
        <select  className='w-full outline-none border-[2px] border-blue-300 focus:border-blue-500 rounded p-2' 
          defaultValue={value}  
        onChange={({currentTarget}) => onChange(currentTarget.value)}
        
        required>
          <option  value={-1}>{`--Select ${label}---`}</option>
        {
          data.map(({id, name}, index) => (
              <option selected={value == id} key={index} value={id}>{name}</option>
          ))
        }
        </select>
        
      </div>
    </>
  )
}

export function FormGroup({label, name, type, value, required, accept, onChange}: {
    type?:string,
    accept?: string,
    required?: boolean,
    value?: string | number,
    label: string, name: string, onChange: (data: string | number | FileList | null) => void}) {
    return (
      <div className='w-[100%] my-5'>
        <p className='text-sm'>{label}</p>
        <input type={type ?? 'text'} name={name} accept={accept}
        value={value}
         onChange={({currentTarget, target}) => {
          if(type == 'file')
              return onChange(target.files)
          return onChange(currentTarget.value)
        }}
        className='w-full outline-none border-[2px] border-blue-300 focus:border-blue-500 rounded p-2'  required={required ?? true}/>
  
      </div>
    )
  }