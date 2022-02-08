import React, { useState, useEffect } from 'react';
import { useTitle } from 'hookrouter';
import Modal from '../../components/modal';
import { getUserId, logout } from '../../hooks/auth';
import Loader from 'react-loader-spinner';
import UserForm from './components/UserForm';

import './index.css';
import { deleteUser, getUserInfo, updateUserInfo } from '../../services/UserService';

const Settings = () => {
  useTitle('Mahoe - Configurações');

  const initalFormState = {
    loading: false,
    isDeleting: false,
    errorMessage: '',
  };

  const [showModal, setShowModal] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [formState, setFormState] = useState(initalFormState);
  const [userState, setUserState] = useState({});
  const [initialUserState, setInitialUserState] = useState({});

  const toString = obj => Object.entries(obj).toString()

  const loadUserInfo = async () => {
    try {
      const userId = getUserId();
      const response = await getUserInfo(userId);
      const user = response.data;
      user.birthday = new Date(user.birthday);

      setInitialUserState(user);
      setUserState(user);
      setIsFetching(false);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadUserInfo();
  }, []);

  const submitUser = async () => {
    setFormState({
      ...formState,
      loading: true,
      errorMessage: '',
    });
    if (formState.isDeleting) {
      try {
        const response = await deleteUser(userState._id);
        if (response.status === 200) {
          logout();
          return;
        }
        closeModal("Não foi possível deletar a usuário");
      } catch (error) {
        console.log(error);
        closeModal(`Erro: ${error.response.data}`);
      }
    }
    // PUT
    else {
      if (toString(initialUserState) === toString(userState)) {
        closeModal();
        return;
      }
      try {
        const { wallet, ...payload } = userState;
        const response = await updateUserInfo(userState._id, payload);
        const user = response.data;
        user.birthday = new Date(user.birthday);
        setInitialUserState(user)
        setUserState(user);
        closeModal();
      } catch (error) {
        console.log(error)
        closeModal(`Erro: ${error.response.data}`);
      }
    }
  }

  const closeModal = (error) => {
    setFormState({
      ...formState,
      loading: false,
      isDeleting: false,
      errorMessage: error
    });
    setShowModal(false);
  }

  const modalHandler = () =>
    <Modal
      onCancel={closeModal}
      onConfirm={submitUser}
    >
      <h2>
        {formState.isDeleting ?
          'Deseja realmente deletar seu usuário?' :
          'Deseja alterar os dados de usuário?'}
      </h2>
    </Modal>
    ;

  const deleteUserModal = () => {
    setFormState({
      ...formState,
      isDeleting: true
    });
    setShowModal(true);
  }

  return (
    <>
      <div>
        <Loader
          type="Puff"
          color="#00BFFF"
          className="loader"
          height={100}
          width={100}
          visible={formState.loading || isFetching}
        />
      </div>
      <div className="container-manage" >
        <h1>Editar Usuário</h1>
        <div className="settings-panel">
          {!isFetching &&
            <UserForm userState={userState} setUserState={setUserState}
              formState={formState} setFormState={setFormState} />
          }
        </div>
        <div className="settings-btns">
          <h4 className="delete-store" onClick={deleteUserModal}>Deletar Conta</h4>
          <div className="align-end-btns">
            <button style={{ marginRight: '10px' }}
              className="btn reset-btn"
              onClick={() => {
                setUserState(initialUserState);
                setFormState(initalFormState)
              }}>
              Resetar
            </button>
            <button className="btn edit-item-btn"
              onClick={() => setShowModal(true)}>
              Salvar
            </button>

          </div>
        </div>
        {showModal && modalHandler()}
      </div>
    </>
  );
};

export default Settings;