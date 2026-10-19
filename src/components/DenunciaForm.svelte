<script lang="ts">
    import { Card, CardHeader, CardBody, CardTitle, Form, FormGroup, CardFooter, Alert, Input, Button, FormText, Spinner, Icon} from '@sveltestrap/sveltestrap'
    import { postarDenuncia, type ReqCriaDenuncia } from '../lib/supabasecalls';

    let descricao : string = $state('')

    let innerTextArea : HTMLElement | undefined = $state(undefined)

    let targetFileElement : HTMLInputElement | undefined = $state(undefined)

    let targetImage : string = $state('')

    let targetImageHasSent : boolean = $state(false)

    let req : ReqCriaDenuncia | undefined = $state(undefined)

    let submited : boolean = $state(false)

    interface Props {
        cep : string,
        rua_id? : string
    }

    let { cep, rua_id }: Props = $props()

    function resizeTextarea() {
        innerTextArea!.style.height = 'auto';
        innerTextArea!.style.height = 4 + innerTextArea!.scrollHeight + 'px';
    }
            
    function getImage() {
        const fileReader = new FileReader()
        fileReader.addEventListener("load", () => {
            targetImage = fileReader.result as string
        })
        fileReader.readAsDataURL(targetFileElement!.files![0])
        targetImageHasSent = true
    }

    function mandarDenuncia(e : Event) {
        e.preventDefault()
        submited = true
        req = {
            cep: cep,
            rua_id: rua_id ?? '',
            descricao: descricao,
            foto: targetFileElement!.files![0]
        }
    }
</script>

<Card>
    <CardHeader>
        <CardTitle>Postar Denuncia ao CEP : {cep}</CardTitle>
    </CardHeader>
    <CardBody>
    {#if !submited}
        <Alert color="warning">
            <h4>Regras para a postagem de denuncias:</h4>
            <ul>
                <li>
                    Não poste informações que identifiquem quem esta fazendo o descarte iregular
                    sendo Placas de Carro, números de localidade ou o nome da pessoa como exemplo.
                </li>
            </ul>
        </Alert>
        <Form on:submit={mandarDenuncia}>
            <FormGroup floating label="Escreva uma mensagem sobre a denuncia">
                <Input type="textarea" required bind:inner={innerTextArea} bind:value={descricao} on:input={resizeTextarea}></Input>
            </FormGroup>
            <FormText>Registe uma foto sobre a denuncia aqui:</FormText>
            <input type="file" accept="image/png,image/jpeg,image/webp" required bind:this={targetFileElement} onchange={getImage}>
            {#if targetImageHasSent}
            <img src={targetImage} alt="">
            {/if}
            <hr>
            <Button type="submit" color="primary">Postar Denuncia</Button>
        </Form>
    {:else}
        {#await postarDenuncia(req as ReqCriaDenuncia)}
            <Spinner color="secondary"></Spinner>
            <p>Postando Denuncia...</p>
        {:then dados}
            <Alert color="success">
                <Icon name="check"></Icon>
                <p>Denuncia Postada!</p>
            </Alert>
        {:catch erro}
            <Alert color="error">
                <Icon name="exclamation-triangle"></Icon>
                <p>A Denuncia não foi postada sucessivamente</p>
                <p>Detalhes do erro: {erro}</p>
            </Alert>
        {/await}
    {/if}
    </CardBody>
    <CardFooter>
        <p>Clique fora dessa tela para sair deste formulario</p>
    </CardFooter>
</Card>