import React from 'react';

function InternationalExhibitionForm({ formData, setFormData, onSubmit, onCancel }) {
  const handleCountryChange = (index, value) => {
    const updatedCountries = [...formData.countries];
    updatedCountries[index] = value;
    setFormData({ ...formData, countries: updatedCountries });
  };

  const addCountry = () => {
    setFormData({
      ...formData,
      countries: [...formData.countries, '']
    });
  };

  const removeCountry = (index) => {
    if (formData.countries.length > 1) {
      const updatedCountries = formData.countries.filter((_, i) => i !== index);
      setFormData({ ...formData, countries: updatedCountries });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="form-container">
      <h2>{formData.id ? 'Edit International Exhibition' : 'Add New International Exhibition'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Add Country Names (International)</label>
          {formData.countries.length === 0 && (
            <p className="hint">Click "Add Country" to start adding countries</p>
          )}
          {formData.countries.map((country, index) => (
            <div key={index} className="country-input-group">
              <input
                type="text"
                placeholder="Enter country name"
                value={country}
                onChange={(e) => handleCountryChange(index, e.target.value)}
                required
              />
              {formData.countries.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeCountry(index)}
                  className="remove-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button 
            type="button" 
            onClick={addCountry}
            className="add-btn"
          >
            + Add Country
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {formData.id ? 'Update' : 'Save'} International Exhibition
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default InternationalExhibitionForm;