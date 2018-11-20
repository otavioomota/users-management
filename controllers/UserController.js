class UserController {
  constructor(formId,tableId){
    this.formEl = document.querySelector(`#${formId}`);
    this.tableEl = document.querySelector(`#${tableId}`);

    this.onSubmit()
  }

  onSubmit() {
    this.formEl.addEventListener('submit', event => {
      event.preventDefault();
      let btnSubmit = this.formEl.querySelector("[type=submit]");
      btnSubmit.disabled = true;
      let user = this.getValues();
      this.getPhoto().then((content) => {
        user.photo = content;
        this.addUser(user);
        this.formEl.reset();
        btnSubmit.disabled = false;
      })
      .catch(e =>  {
        console.error(e)
      })
    });
  }

  getPhoto(){
    return new Promise((resolve,reject) => {
      let fileReader =  new FileReader();
      let elements = [...this.formEl.elements].filter(item => {
        if(item.name === 'photo'){
          return item;
        }
      });
      let file = elements[0].files[0];
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (e) => {
        reject(e);
      }
      file ? fileReader.readAsDataURL(file) :resolve('dist/img/boxed-bg.jpg');
    })
  }
  getValues() {
    var user = {};
    var isValid = true;
    [...this.formEl.elements].forEach((field,index) => {
      if(['name','email','password'].indexOf(field.name) > -1 && !field.value){
        field.parentElement.classList.add('has-error');
        isValid = false;
      }
      if(field.name ==  'gender'){
        if(field.checked){
          user[field.name] = field.value;
        }
      } else if(field.name == 'admin'){
        user[field.name] = field.checked;
      }
      else {
          user[field.name] = field.value;
        }
    })
    if(!isValid){
      return false;
    }
    return new User (
      user.name,
      user.gender,
      user.birth,
      user.country,
      user.email,
      user.password,
      user.photo,
      user.admin
    );
  }

  addUser(userData) {
    let tr  =  document.createElement('tr');
    tr.dataset.user = userData;
    tr.innerHTML = `
          <td><img src="${userData.photo}" alt="User Image" class="img-circle img-sm"></td>
          <td>${userData.name}</td>
          <td>${userData.email}</td>
          <td>${(userData.admin ? 'Sim' : "Não")}</td>
          <td>${Utils.dateFormat(userData.register)}</td>
          <td>
            <button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
            <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
          </td>
      `;
    this.tableEl.appendChild(tr);
    this.updateCount();
  };
  updateCount(){
    let numUsers = 0;
    let numUsersAdmin = 0;

    [...this.tableEl.children].forEach(tr => {
      numUsers++;
      let user = JSON.parse(tr.dataset.user);
      if(user._admin) numUsersAdmin++;
    })
    document.querySelector('#number-users').innerHTML = numUsers;
    document.querySelector('#number-users-admin').innerHTML = numUsersAdmin;
  }

}
