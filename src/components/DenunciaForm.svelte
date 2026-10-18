<script lang="ts">
    import { Card, CardHeader, CardBody, CardTitle, Form, FormGroup, CardFooter, Alert, Input, Button, FormText} from '@sveltestrap/sveltestrap'

    let descricao : string = ''

    let innerTextArea : HTMLElement

    let targetFile : HTMLInputElement

    let targetImage : string

    let targetImageHasSent : boolean = false

    export let cep : string

    function resizeTextarea() {
        innerTextArea.style.height = 'auto';
        innerTextArea.style.height = 4 + innerTextArea.scrollHeight + 'px';
    }

    function getImage() {
        const fileReader = new FileReader()
        fileReader.addEventListener("load", () => {
            targetImage = fileReader.result as string
        })
        fileReader.readAsDataURL(targetFile.files![0])
        targetImageHasSent = true
    }

    function mandarDenuncia(e : Event) {
        e.preventDefault()
    }
</script>

<Card>
    <CardHeader>
        <CardTitle>Postar Denuncia ao CEP : {cep}</CardTitle>
    </CardHeader>
    <CardBody>
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
            <input type="file" accept="image/*" required bind:this={targetFile} on:change={getImage}>
            {#if targetImageHasSent}
            <img src={targetImage} alt="">
            {/if}
            <hr>
            <Button type="submit" color="primary">Postar Denuncia</Button>
        </Form>
    </CardBody>
    <CardFooter>
        <p>Clique fora dessa tela para sair deste formulario</p>
    </CardFooter>
</Card>