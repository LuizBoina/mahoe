import React, { useContext } from "react";
import { navigate, A, useTitle } from "hookrouter";
import { registerLocale } from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import pt from 'date-fns/locale/pt-BR';
import { login } from "../../hooks/auth";
import AuthContext from '../../hooks/auth';

import './index.css';
import UserForm from "./components/UserForm";
import cpfValidator from "../../utils/cpfValidator";
import cnpjValidator from "../../utils/cnpjValidator";
import { createUser } from "../../services/UserService";
import Loader from "react-loader-spinner";

registerLocale('pt', pt);

export const SignUp = () => {
  useTitle('Mahoe - Cadastro');

  const { setIsSigned } = useContext(AuthContext);

  const initialManagerState = {
    name: "",
    email: "",
    birthday: new Date(),
    document: "",
    phoneNumber: "",
    password: "",
  };

  const initialFormState = {
    isSubmitting: false,
    errorMessage: null,
  }

  const [userState, setUserState] = React.useState(initialManagerState);
  const [formState, setFormState] = React.useState(initialFormState);

  const testManagerFields = async () => {
    if (!userState.password.trim().length || !userState.email.trim().length || !userState.name.trim().length
      || !userState.birthday || !userState.document.trim().length) {
      return "Complete todos os campos marcados com *";
    }

    if (userState.password.length <= 6) {
      return "Senha deve ser maior que 6 caracteres";
    }

    if (userState.phoneNumber.length !== 15) {
      return "Número de telefone inválido";
    }

    const doc = userState.document.replace(/\D/g, '');
    if ((doc.length === 11 && !cpfValidator(userState.document)) ||
      (doc.length === 14 && !cnpjValidator(userState.document))) {
      return "Documento inválido";
    }

    const currentDate = new Date();
    let age = currentDate.getFullYear() - userState.birthday.getFullYear();
    const m = currentDate.getMonth() - userState.birthday.getMonth();
    if (m < 0 || (m === 0 && currentDate.getDate() < userState.birthday.getDate())) {
      age--;
    }

    if (age <= 16) {
      return "Apenas usuários maiores de 16 anos podem se cadastrar";
    }
  }

  const handleFormSubmit = async event => {
    event.preventDefault();
    setFormState({
      ...formState,
      isSubmitting: true,
      errorMessage: ''
    });
    try {
      const errorMessage = await testManagerFields();
      if (errorMessage) {
        setFormState({
          ...formState,
          isSubmitting: false,
          errorMessage: errorMessage
        });
        return;
      }
      const res = await createUser(userState);
      if (res.status === 200) {
        login(res.data);
        setIsSigned(true);
        navigate('/');
      }
      else {
        navigate('/login');
      }
    } catch (error) {
      if (error.response.status === 400) {
        setFormState({
          ...formState,
          isSubmitting: false,
          errorMessage: `Erro! ${error.response.data}`
        });
      }
      else {
        setFormState({
          ...formState,
          isSubmitting: false,
          errorMessage: `Erro! ${error.response.data}`
        });
      }
    }
  };

  return (
    <>
      <Loader
        type="Puff"
        color="#00BFFF"
        className="loader"
        height={100}
        width={100}
        visible={formState.isSubmitting}
      />
      <div className="signup-container">
        <div className="card-store">
          <div className="container">
            <UserForm data={userState} setData={setUserState} />
            <div style={{ textAlign: '-webkit-center' }}>
              {formState.errorMessage && (
                <span className="form-error">{formState.errorMessage}</span>
              )}
              <div className="signup-btn">
                <button disabled={formState.isSubmitting}
                  onClick={handleFormSubmit}>
                  {formState.isSubmitting ? (
                    "Carregando..."
                  ) : "Criar"}
                </button>
              </div>
              <hr />
              <A href='/login'>Já possui uma conta?</A>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default SignUp;