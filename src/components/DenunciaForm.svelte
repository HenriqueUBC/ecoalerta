<script lang="ts">
    import { Card, CardHeader, CardBody, CardTitle, Form, FormGroup, CardFooter} from '@sveltestrap/sveltestrap'

    let { cep } = $props()
</script>

<Card>
    <CardHeader>
        <CardTitle>Postar Denuncia ao CEP : {cep}</CardTitle>
    </CardHeader>
    <CardBody>
        <Form>
            <FormGroup>

            </FormGroup>
        </Form>
    </CardBody>
    <CardFooter>
        <p>Clique fora dessa tela para sair deste formulario</p>
    </CardFooter>
</Card>