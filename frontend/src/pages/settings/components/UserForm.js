import DatePicker from "react-datepicker";
import cnpjMask from "../../../utils/cnpjMask";
import cpfMask from "../../../utils/cpfMask";
import phoneNumberMask from "../../../utils/phoneNumberMask";
import PasswordField from "../../../components/forms/passwordField";

const UserForm = ({ userState, setUserState }) => {

  const handleInputChange = event => {
    setUserState({
      ...userState,
      [event.target.name]: event.target.value
    });
  };

  const handleDocumentChange = event => {
    const doc = event.target.value.replace(/\D/g, '');
    if (doc.length === 11) {
      setUserState({
        ...userState,
        document: cpfMask(doc),
      });
    } else if (doc.length === 14) {
      setUserState({
        ...userState,
        document: cnpjMask(doc)
      });
    }
  };

  const handlePhoneChange = event => {
    setUserState({
      ...userState,
      phoneNumber: phoneNumberMask(event.target.value),
    });
  };

  const handleDateChange = date => {
    setUserState({
      ...userState,
      birthday: date,
    });
  }

  return (
    <form>
      <label htmlFor="name">
        Nome
        <input
          type="text"
          value={userState.name}
          onChange={handleInputChange}
          name="name"
          id="name"
          placeholder="Digite seu nome..."
          required
        />
      </label>

      <label htmlFor="email">
        Email
        <input
          type="text"
          value={userState.email}
          onChange={handleInputChange}
          name="email"
          id="email"
          placeholder="Digite seu email..."
          required
        />
      </label>

      <label htmlFor="birthday">
        Data de nascimento
        <DatePicker
          id="birthday"
          name="birthday"
          dateFormat="P"
          locale='pt'
          className="date-field"
          selected={userState.birthday}
          onChange={handleDateChange}
          required
        />
      </label>

      <label htmlFor="document">
        Documento
        <input
          type="text"
          value={userState.document}
          onBlur={handleDocumentChange}
          onChange={handleInputChange}
          name="document"
          id="document"
          placeholder="Digite seu CPF ou CNPJ..."
          required
        />
      </label>

      <label htmlFor="phoneNumber">
        Telefone
        <input
          maxLength='15'
          type="text"
          value={userState.phoneNumber}
          onChange={handlePhoneChange}
          name="phoneNumber"
          id="phoneNumber"
          placeholder="(XX) XXXXX-XXXX"
          required
        />
      </label>

      <label htmlFor="old-password">
        Senha antiga
        <PasswordField state={userState} setState={setUserState} fieldName={"oldPassword"} />
      </label>

      <label htmlFor="new-password">
        Senha nova
        <PasswordField state={userState} setState={setUserState} fieldName={"newPassword"} />
      </label>
    </form>
  )
}

export default UserForm;