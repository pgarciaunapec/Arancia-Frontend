import * as yup from "yup";

const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s0-9]*$/;

export const loginSchema = yup.object({
  email: yup
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido.")
    .required("El correo electrónico es obligatorio."),
  password: yup
    .string()
    .required("La contraseña es obligatoria.")
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
});

export const registerSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Tu nombre completo es obligatorio.")
    .min(2, "El nombre debe tener al menos 2 caracteres.")
    .max(100, "El nombre no puede superar los 100 caracteres."),
  email: yup
    .string()
    .trim()
    .email("Ingresa un correo electrónico válido.")
    .required("El correo electrónico es obligatorio."),
  phone: yup
    .string()
    .trim()
    .nullable()
    .transform((value) => (value ? value : ""))
    .test(
      "is-valid-phone",
      "Ingresa un teléfono válido.",
      (value) => !value || phoneRegex.test(value),
    ),
  password: yup
    .string()
    .required("La contraseña es obligatoria.")
    .min(6, "La contraseña debe tener al menos 6 caracteres."),
  confirmPassword: yup
    .string()
    .required("Debes confirmar tu contraseña.")
    .oneOf([yup.ref("password")], "Las contraseñas no coinciden."),
});

export const contactSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("El nombre es obligatorio.")
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  email: yup
    .string()
    .trim()
    .email("Ingresa un correo válido.")
    .required("El correo electrónico es obligatorio."),
  phone: yup
    .string()
    .trim()
    .nullable()
    .transform((value) => (value ? value : ""))
    .test(
      "is-valid-phone",
      "Ingresa un teléfono válido.",
      (value) => !value || phoneRegex.test(value),
    ),
  subject: yup
    .string()
    .trim()
    .required("Debes indicar el asunto del mensaje.")
    .max(140, "El asunto no puede superar los 140 caracteres."),
  message: yup
    .string()
    .trim()
    .required("El mensaje es obligatorio.")
    .min(10, "El mensaje debe tener al menos 10 caracteres.")
    .max(2000, "El mensaje no puede superar los 2000 caracteres."),
});

export const reservationSchema = yup.object({
  date: yup
    .string()
    .required("Selecciona una fecha para la reserva.")
    .test("is-valid-date", "La fecha seleccionada no es válida.", (value) => {
      if (!value) {
        return false;
      }
      const date = new Date(`${value}T00:00:00`);
      return !Number.isNaN(date.getTime());
    }),
  time: yup
    .string()
    .required("Selecciona una hora para la reserva.")
    .matches(
      /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      "La hora debe estar en formato HH:MM.",
    ),
  guests: yup
    .number()
    .transform((value, originalValue) => Number(originalValue))
    .typeError("El número de personas debe ser numérico.")
    .min(1, "Debe haber al menos 1 persona.")
    .max(20, "Solo permitimos hasta 20 personas por reserva.")
    .required("Indica cuántas personas asistirán."),
  name: yup
    .string()
    .trim()
    .required("El nombre de contacto es obligatorio.")
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  email: yup
    .string()
    .trim()
    .email("Ingresa un correo válido.")
    .required("El correo de contacto es obligatorio."),
  phone: yup
    .string()
    .trim()
    .required("El teléfono de contacto es obligatorio.")
    .test("is-valid-phone", "Ingresa un teléfono válido.", (value) =>
      value ? phoneRegex.test(value) : false,
    ),
  notes: yup
    .string()
    .trim()
    .max(500, "Las notas no pueden superar los 500 caracteres.")
    .nullable()
    .transform((value) => (value ? value : "")),
});

export const profileSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("El nombre es obligatorio.")
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  email: yup
    .string()
    .trim()
    .email("Ingresa un correo válido.")
    .required("El correo electrónico es obligatorio."),
  phone: yup
    .string()
    .trim()
    .nullable()
    .transform((value) => (value ? value : ""))
    .test(
      "is-valid-phone",
      "Ingresa un teléfono válido.",
      (value) => !value || phoneRegex.test(value),
    ),
  address: yup
    .string()
    .trim()
    .max(200, "La dirección no puede superar los 200 caracteres.")
    .nullable()
    .transform((value) => (value ? value : "")),
});

export const passwordUpdateSchema = yup.object({
  current: yup.string().required("La contraseña actual es obligatoria."),
  new: yup
    .string()
    .required("La nueva contraseña es obligatoria.")
    .min(6, "La nueva contraseña debe tener al menos 6 caracteres."),
  confirm: yup
    .string()
    .required("Confirma la nueva contraseña.")
    .oneOf([yup.ref("new")], "La confirmación no coincide con la contraseña."),
});

export const checkoutSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("El nombre de entrega es obligatorio.")
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  email: yup
    .string()
    .trim()
    .email("Ingresa un correo válido.")
    .required("El correo electrónico es obligatorio."),
  address: yup
    .string()
    .trim()
    .required("La dirección de entrega es obligatoria.")
    .min(5, "La dirección debe tener al menos 5 caracteres."),
  city: yup.string().trim().required("La ciudad es obligatoria."),
  cardNumber: yup
    .string()
    .trim()
    .test("card-number-format", "El número de tarjeta no es válido.", (value) => {
      if (!value) return true;
      const digits = value.replace(/\s/g, "");
      return /^[0-9]{13,19}$/.test(digits);
    }),
  cardExp: yup
    .string()
    .trim()
    .test("card-exp-format", "La fecha debe tener formato MM/AA.", (value) => {
      if (!value) return true;
      return /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(value);
    }),
  cardCvv: yup
    .string()
    .trim()
    .test("card-cvv-format", "El CVV debe tener 3 o 4 dígitos.", (value) => {
      if (!value) return true;
      return /^[0-9]{3,4}$/.test(value);
    }),
});

export const eventQuoteSchema = yup.object({
  eventType: yup
    .string()
    .oneOf(
      ["social", "corporativo", "privado", "otro"],
      "Selecciona un tipo de evento válido.",
    )
    .required("Selecciona el tipo de evento."),
  packageName: yup.string().trim().nullable(),
  name: yup
    .string()
    .trim()
    .required("El nombre es obligatorio.")
    .min(2, "El nombre debe tener al menos 2 caracteres."),
  email: yup
    .string()
    .trim()
    .email("Ingresa un correo válido.")
    .required("El correo es obligatorio."),
  phone: yup
    .string()
    .trim()
    .required("El teléfono es obligatorio.")
    .test("is-valid-phone", "Ingresa un teléfono válido.", (value) =>
      value ? phoneRegex.test(value) : false,
    ),
  guests: yup
    .number()
    .transform((value, originalValue) => Number(originalValue))
    .typeError("La cantidad de invitados debe ser numérica.")
    .min(1, "Debe haber al menos 1 invitado.")
    .max(500, "No se permiten más de 500 invitados.")
    .required("La cantidad de invitados es obligatoria."),
  preferredDate: yup.string().trim().nullable(),
  notes: yup
    .string()
    .trim()
    .max(1000, "Las notas no pueden superar 1000 caracteres."),
});
