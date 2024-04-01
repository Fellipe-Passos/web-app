import { createTheme } from "@mantine/core";

const theme = createTheme({
    colors: {
        // main: [
        //     "#E3DCFA",
        //     "#DCD3F9",
        //     "#D4CAF7",
        //     "#CDC2F6",
        //     "#6F4EE5",
        //     "#6441E3",
        //     "#5933E1",
        //     "#4E26DF",
        //     "#471FD6",
        //     "#3F1CBC",
        // ],
        // main: [
        //     "#5A7CFD",
        //     "#5074FD",
        //     "#466CFD",
        //     "#3C64FD",
        //     "#325CFD",
        //     "#2350FD",
        //     "#1444FD",
        //     "#0538FD",
        //     "#0233EF",
        //     "#0230E0",
        // ]
        main: [
            "#75A99F",
            "#6FA59B",
            "#68A196",
            "#629D92",
            "#5E978C",
            "#5A9186",
            "#568A80",
            "#52847A",
            "#4E7E75",
            "#4A786F",
        ]
    },
    fontFamily: "Rubik",
    fontFamilyMonospace: 'Rubik',
    primaryColor: "main",
    headings: {
        fontFamily: 'Rubik'
    },
    components: {
        Button: {
            defaultProps: {
                radius: "xl",
            },
        },
        Table: {
            styles: (theme: { colors: { main: any[]; }; }) => ({
                thead: {
                    backgroundColor: theme.colors.main[0],
                    color: "#FFF",
                    textTransform: 'uppercase',
                },
                tbody: {
                    fontSize: '.65rem'
                }
            })
        }
    },
});

export { theme };