import { createSystem, defaultConfig } from "@chakra-ui/react";

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        primary: {
          value: "#190482",
        },
        secondary: {
          value: "#7752FE",
        },
        tertiary: {
          value: "#8E8FFA",
        },
        quaternary: {
          value: "#C2D9FF",
        },
      },
      gradients: {
        linearGradient: {
          value:
            "linear-gradient(90deg, rgba(25,4,130,1) 0%, rgba(119,82,254,1) 29%, rgba(142,143,250,1) 100%)",
        },
        radialGradient: {
          value:
            "radial-gradient(circle, rgba(119,82,254,1) 0%, rgba(142,143,250,1) 50%, rgba(25,4,130,1) 85%)",
        },
      },
      borders: {
        standard: {
          value: "1px solid #190482",
        },
      },
      opacity: {
        transparent: {
          value: 0.0,
        },
      },
      fonts: {
        heading: { value: `BatamyRegular, sans-serif` },
        body: { value: `sans-serif` },
      },
    },
  },
});
