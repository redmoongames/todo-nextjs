export interface LoginContent {
  title: string;
  description: string;
  form: {
    title: string;
    usernamePlaceholder: string;
    passwordPlaceholder: string;
    submitButton: string;
    registerButton: string;
  };
  demo: {
    login: string;
    password: string;
  };
}

export const defaultLoginContent: LoginContent = {
  title: "Test task",
  description: `Работающее TODO list приложение, дизайн + фронт + бэк.

Пользователь должен иметь возможность создавать задания, а также их выполнять. 
Задания имеют заголовок и описание, можно выставить приоритетность и тэги, связанные с заданием. 
В приложении должен быть реализован поиск по заданиям. 
Дизайн свободный, ограничений нет.`,
  form: {
    title: "Login",
    usernamePlaceholder: "Username",
    passwordPlaceholder: "Password",
    submitButton: "Login",
    registerButton: "Register"
  },
  demo: {
    login: "user",
    password: "1234"
  }
}; 