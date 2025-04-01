/* eslint-disable no-unused-vars */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles/reset.layer.css";
import "@aws-amplify/ui-react/styles/base.layer.css";
import "@aws-amplify/ui-react/styles/button.layer.css";
import "@aws-amplify/ui-react/styles.css";
import { Button, Flex, ThemeProvider} from "@aws-amplify/ui-react";

// const theme = {
//   name: "button-theme",
//   tokens: {
//     colors: {
//       border: {
//         // this will affect the default button's border color
//         primary: { value: "black" },
//       },
//     },
//     components: {
//       button: {
//         // this will affect the font weight of all button variants
//         fontWeight: { value: "{fontWeights.extrabold}" },
//         backgroundColor: { value: "#f1fff5" },
//         borderColor: { value: "" },
//         color: { value: "{colors.purple.100}" },
//         outlined: {
//           info: {
//             borderColor: "{colors.purple.60}",
//             color: "{colors.purple.90}",
//           },
//         },

//         // style the primary variation
//         primary: {
//           backgroundColor: { value:  "background: linear-gradient(to bottom right, #e0bbf4, #a3bffa) !important" },
//           _hover: {
//             backgroundColor: { value: "{colors.purple.80}" },
//           },
//           _focus: {
//             backgroundColor: { value: "{colors.blue.80}" },
//           },
//           _active: {
//             backgroundColor: { value: "{colors.blue.90}" },
//           },
//           _disabled: {
//             backgroundColor: { value: "transparent" },
//             borderColor: { value: "{colors.neutral.30}" },
//           },
//           error: {
//             backgroundColor: { value: "{colors.pink.10}" },
//             color: { value: "{colors.red.80}" },
//             _hover: {
//               backgroundColor: { value: "#a51b34" },
//             },
//             _focus: {
//               backgroundColor: { value: "#9a0c26" },
//             },
//             _active: {
//               backgroundColor: { value: "#9a0c26" },
//             },
//           },
//         },
//       },
//     },
//   },
// };
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "us-east-1_TChGvqSDh",
      userPoolClientId: "55l4ioie3hpvtnhud7ou1el4m7",
      loginWith: {
        email: true,
      },
      signUpVerificationMethod: "code",
      userAttributes: {
        family_name: {
          required: true,
          order: 1,
        },
        given_name: {
          required: true,
        },

        email: {
          required: true,
        },
      },
      allowGuestAccess: true,
      passwordFormat: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireNumbers: true,
        requireSpecialCharacters: true,
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <ThemeProvider theme={theme} colorMode="light"> */}
      <App />
    {/* </ThemeProvider> */}
  </StrictMode>
);
