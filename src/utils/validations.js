export const  validateWorkerEntryForm = (formData) => {
      const errors = [];
      
      if (!formData.firstName) {
        errors.push("Please Enter First Name");
      }
      if (!formData.lastName) {
        errors.push("Please Enter Last Name");
      }
      if (!formData.roleId) {
        errors.push("Please select a Role");
      }
      if (!formData.nicNumber) {
        errors.push("Please Enter a NIC number");
      }
      if (formData.nicNumber) {
        const nic = String(formData.nicNumber).trim();
        const nicRegex = /^(\d{9}[vx]|\d{12})$/i;
        if (!nicRegex.test(nic)) {
          errors.push("NIC Number is invalid");
        }
      }
      if (!formData.phone) {
        errors.push("Please Enter a Phone number");
      }
      if (formData.phone) {
        const mobileRegex = /^(?:\+94|0)7\d{8}$/;
        if(!mobileRegex.test(formData.phone))
          errors.push("Phone Number is invalid");
      }
      if (formData.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(formData.email))
          errors.push("Please Enter a valid email adress");
      }
       if (!formData.address) {
        errors.push("Please Enter Address");
      }
      if (!formData.dob) {
        errors.push("Please select DOB");
      }
      
      return errors;
    };

export const  validateTaskEntryForm = (formData) => {
      const errors = [];
      
      if (!formData.taskName) {
        errors.push("Please Enter Task Name");
      }
      if (!formData.description) {
        errors.push("Please Enter Description");
      }
      if (!formData.taskType) {
        errors.push("Please select a task type");
      }
      if (!formData.taskStatus) {
        errors.push("Please select a task status");
      }
      if (!formData.startDateTime) {
        errors.push("Please select a start date");
      } 
      if (!formData.assignedSupervisor) {
        errors.push("Please select a supervisor");
      }
      if (!formData.placeId) {
        errors.push("Please select a place");
      }
      if (!formData.teamId && !formData.workerId) {
        errors.push("Please select a person or a team");
      }
      
      
      return errors;
};