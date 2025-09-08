const FormRow =({type, name, value, handleChange, labelText}) =>{
    return(
        <div className="form-row">
            <label htmlFor={name} className="form-html">{labelText || name}</label>
            <input
            id={name}
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            className="form-input"
            />
        </div>
    );
};
export default FormRow;