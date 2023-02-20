# BULLETS DIAGRAMATION


<!-- DOCS-IGNORE:start -->
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->
<!-- DOCS-IGNORE:end -->

Slider de productos que permite apuntar a categorías de nivel inferior, contiene un `schema` que permitira modificar la información contenida desde el **admin** de VTEX IO

![image](https://user-images.githubusercontent.com/83648336/220131053-bae430ca-7cd8-459e-b3e0-e4439dc55052.png)

## Configuración

1. Usar el template [vtex-app](https://github.com/vtex-apps/react-app-template)
2. Modificar el `manifest.json`
     ```json 
        {
          "vendor": "itgloberspartnercl",
          "name": "bullets-diagramation",
          "version": "0.0.1",
          "title": "Bullets diagramation",
          "description": "Es un contexto de elementos que renderiza los niveles inferiores de una lista",
        }
     ``` 
      **vendor:** nombre del cliente o información suministrada por él

      **name:** nombre del componente

      **version:** versión del componente

      **title:** titulo asigando al componente

      **description:** breve descripción del componente


   Agregar en la sección `builders` dentro del `manifest.json` un `store`

    ```json   
        "store" : "0.x"
    ```
   En `dependencies` se van a agregar las siguientes dependencias necesarias para el funcionamiento del **componente**

    ```json   
        "dependencies": {
          "vtex.native-types": "0.x",
          "vtex.list-context": "0.x",
          "vtex.device-detector": "0.x",
          "vtex.css-handles": "0.x"
        }
    ```  
3. En el template se tienen dos `package.json` en ambos se debe modificar la `version` y el `name` 
   ```json 
         "version": "0.0.1",
         "name": "bullets-diagramation",
   ```  
4. Agregar a la carpeta raíz una carpeta llamada `store`, dentro crear un file llamado `interfaces.json`, en este file se tendrá la siguiente configuración:
    ```json 
        {
          "list-context.bullets-group": {
                "component": "BulletGroup",
                "composition": "children",
                "allowed": "*",
                "content": {
                    "properties": {
                        "bullets": {
                            "$ref": "app:itgloberspartnercl.bullets-diagramation#/definitions/BulletGroup"
                        }
                    }
                }
            }
        }
    ```
      Se especifica el nombre del componente con el cual será llamado en el `store-theme` de la tienda que se esta realizando, dentro se encuentra el `component` (se debe poner el nombre del componente React a realizar), `composition`, `allowed` y `content` que contendrá `properties`. 
      
      En la misma carpeta `store` se genera otro json llamado `contentSchemas`, acá se define la estructura que tendrá el componente para su modificación desde el **admin** 
   
   ```json
       {
        "definitions": {
            "BulletGroup": {
                "type": "array",
                "title": "Bullets Group",
                "items": {
                    "properties": {
                        "image": {
                            "$ref": "app:vtex.native-types#/definitions/url",
                            "default": "",
                            "title": "Imagen",
                            "widget": {
                                "ui:widget": "image-uploader"
                            }
                        },
                        "titleBullet": {
                            "title": "Titulo de Bullet",
                            "$ref": "app:vtex.native-types#/definitions/text",
                            "default": ""
                        },
                        "link": {
                            "title": "Link de Bullet",
                            "$ref": "app:vtex.native-types#/definitions/link",
                            "default": ""
                        }
                    }
                 }
              }
           }
        }
    ```

5. Finalizado los puntos anteriores, se procede a ingresar a la carpeta `react` en la cual se realizan las siguientes configuraciones: 
    
    5.1. Ejecutar el comando `yarn install` para preparar las dependencias
    
    5.2. Crear el functional component `BulletGroup.tsx` con la siguiente configuración 
    
    ```typescript
          import BulletGroup from "./components/BulletGroup";

          export default BulletGroup;
    ```   
    5.3. Crear una carpeta llamada `components`, dentro se tiene una segunda carpeta `BulletGroup` que contendrá lo siguiente: 
    
    5.3.1. `index.tsx` contendrá la configuración principal del componente
    ```typescript
          import React, { PropsWithChildren } from 'react';
          import { BulletsSchema } from './BulletTypes';
          import { getBulletsAsTSXList } from './modules/bulletsAsList';
          import { useDevice } from 'vtex.device-detector';
          import { useListContext, ListContextProvider } from 'vtex.list-context';
          import { useCssHandles } from 'vtex.css-handles';


          export interface BulletGroupProps {
              bullets: BulletsSchema
          }

          const BulletGroup = ({
              bullets,
              children
          }: PropsWithChildren<BulletGroupProps>) => {
              const { isMobile } = useDevice();
              const { list } = useListContext() || []

              const bulletsGroup = getBulletsAsTSXList(bullets);
              const newListContextValue = list.concat(bulletsGroup);

              const CSS_HANDLES = ["bullet__container"];
              const handles = useCssHandles(CSS_HANDLES);

              return (
                  <ListContextProvider list={newListContextValue}>
                      {
                          isMobile
                              ?
                              <div
                                  className={handles.bullet__container}
                              >
                                  {bulletsGroup}
                              </div>
                              :
                              children
                      }
                  </ListContextProvider>
              )
          }

          export default BulletGroup;
    ```
    
    5.3.2. `BulletTypes.ts` se especificaran las props empleadas remitirse a sección de [Propiedades](#propiedades) para mayor información
    ```typescript
       export type BulletsSchema = Array<{
            image: string
            titleBullet: string
            link?: LinkProps
        }>

        export interface LinkProps {
            url: string
            attributeNofollow?: boolean
            attributeTitle?: string
            openNewTab?: boolean
            newTab?: boolean
        }
    ```
    
    5.3.3. `Bullet.tsx` tiene la configuración para el **item**
    ```typescript
        import React from 'react'
        import { Link } from 'vtex.render-runtime';
        import { LinkProps } from './BulletTypes';
        import { useCssHandles } from 'vtex.css-handles';

        import './styles.css'

        type Props = {
            src: string
            titleBullet: string
            link: LinkProps
        }

        const Bullet = ({ src, titleBullet, link }: Props) => {
            const CSS_HANDLES = [
                "bullet__item",
                "bullet__item--title",
                "bullet__item--image",
                "bullet__item--link"
            ]

            const handles = useCssHandles(CSS_HANDLES)

            return (
                <div className={handles["bullet__item"]}>
                    <Link
                        className={handles["bullet__item--link"]}
                        to={link.url}
                    >
                        <img
                            className={handles["bullet__item--image"]}
                            src={src}
                            alt={titleBullet}
                        />
                        <p className={handles["bullet__item--title"]}>
                            {titleBullet}
                        </p>
                    </Link>
                </div>
              )
          }

          Bullet.schema = {
              title: "Bullet",
              type: "object",
              properties: {
                  src: {
                      title: "Imagen de Bullet",
                      type: "string",
                      widget: {
                          "ui:widget": "image-uploader"
                      }
                  }
              }
          }

          export default Bullet
    ```
    
    5.3.4. Se crea una carpeta `modules` dentro de **BulletGroup**, se crea el archivo `bulletsAsList.tsx`
    ```typescript
        import React from 'react';
        import { BulletsSchema } from '../BulletTypes';
        import Bullet from '../Bullet'

        export const getBulletsAsTSXList = (
            bullets: BulletsSchema
        ) => (
            bullets.map((bullet: any, index) => {

                return <Bullet
                    key={index}
                    src={bullet.image}
                    titleBullet={bullet.titleBullet}
                    link={
                        bullet.link
                            ? bullet.link
                            :
                            {
                                url: "",
                                attributeNofollow: false,
                                attributeTitle: "",
                                openNewTab: false,
                                newTab: false
                            }
                    }
                />
            })
        )
    ```

6. Linkear el componente custom al `store-theme` de la tienda base

    6.1. Iniciar sesión 
    ```console
       vtex login <vendor>
    ```

    6.2. Elegir el `workspace` en el cual se esta trabajando
    ```console
       vtex use <nombre_worksapce>
    ```

    6.3. Linkear el componente
    ```console
       vtex link
    ```

    6.4. Verificar que el componente quede linkeado, para eso se emplea el siguiente comando

     ```console
        vtex ls
     ```

    En consola debe verse las aplicaciones linkeadas al proyecto, verificando de esta forma que el componente quedo listo para emplearse:

    ```console
        Linked Apps in <vendor> at workspace <nombre_store_theme>
        itgloberspartnercl.bullets-diagramation         0.0.1
     ```
      
7. Hacer el llamado del componente desde el `store theme`

## Propiedades

### `Props` 

| Nombre Prop    | Tipo           | Descripción                                                |
| ------------   | ---------------| ---------------------------------------------------------- |
| `image`        | `string`       | Imagen que se renderizará en la pagina                     |
| `titleBullet`  | `string`       | Titulo del Bullet                                          |
| `link`         | `array`        | Contendrá la lista de propiedades a emplear                |

- `LinkProps` object:

| Nombre Prop            | Tipo           |
| ---------------------- | -------------- |
| `url`                  | `string`       |
| `attributeNofollow`    | `boolean`      |
| `attributeTitle`       | `string`       |
| `openNewTab`           | `boolean`      | 
| `newTab`               | `boolean`      | 

Tipos de Prop empleadas: 

- `string` 
- `number`
- `array`
- `boolean`

## Personalización
      

Para personalizar el componente con CSS, siga las instrucciones que se encuentran en [Using CSS Handles for store customization](https://developers.vtex.com/docs/guides/vtex-io-documentation-using-css-handles-for-store-customization).

Las clases empleadas en el componente son:

| CSS Handles           |
| --------------------- | 
| `bullet__container`   | 
| `bullet__item`        | 
| `bullet__item--image` | 
| `bullet__item--link`  | 
| `bullet__item--title` | 

<!-- DOCS-IGNORE:start -->

## Colaboradores ✨

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Mariana Orrego Franco

<!-- DOCS-IGNORE:end -->
