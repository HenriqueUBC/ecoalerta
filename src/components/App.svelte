<script lang="ts">
  import { 
    Styles, 
    Container, 
    Input, 
    Form, 
    FormGroup, 
    Button, 
    Spinner, 
    CardHeader, 
    CardTitle, 
    Card, 
    CardBody, 
    CardText, 
    CardSubtitle} from '@sveltestrap/sveltestrap'
  import { consultarCep, isCepValido, isErroInfoCep, isInfoCep, type ErroInfoCep, type InfoCep } from '../lib/viacep';

  let inputCep : string = $state("")
  let ultimoCep : string = $state("")
  let cepVerificado : boolean = $state(false)
  let currentCep : InfoCep | ErroInfoCep | undefined = $state(undefined)

  // Previne o usuario de digitar letras no cep
  $effect(() => {
    inputCep = inputCep.replace(/[^0-9]/g, '')
  })

  function cepSubmit(e : SubmitEvent) {
    e.preventDefault()
    cepVerificado = isCepValido(inputCep)
    if (!cepVerificado) {
      window.alert("CEP não é valido, digite apenas 8 números")
      return
    }
    ultimoCep = inputCep
  }

  // isso é para manter o resultado da variavel fora do scopo
  // do bloco await;
  async function cepCall(cep : string) {
    currentCep = await consultarCep(cep)
    return currentCep
  }

</script>

<Styles />

<Container sm>
  <Form on:submit={(e) => cepSubmit(e)}>
    <FormGroup floating label="Digite seu CPF Aqui">
      <Input required maxlength={8} pattern="[0-9.]*" bind:value={inputCep}></Input>
      <Button type="submit" color="primary">Procurar Denuncias...</Button>
    </FormGroup>
  </Form>

  {#if cepVerificado}
    {#await cepCall(ultimoCep)}
      <Spinner color="secondary"></Spinner>
      <p>Carregando informações do CEP...</p>
    {:then valor} 
      {#if isInfoCep(valor)}
        <Card>
          <CardHeader>
            <CardTitle>CEP Encontrado!</CardTitle>
          </CardHeader>
          <CardBody>
            <CardText>
              <b>Rua:</b> {valor.logradouro} <br>
              <b>Bairro:</b> {valor.bairro} <br>
              <b>Cidade:</b> {valor.localidade} <br>
              <b>Estado:</b> {valor.estado}
            </CardText>
          </CardBody>
        </Card>
      {/if}
      {#if isErroInfoCep(valor)}
        <Card>
          <CardHeader>
            <CardTitle>CEP Não foi Encontrado!</CardTitle>
          </CardHeader>
        </Card>
      {/if}
    {:catch erro}
        <Card>
          <CardHeader>
            <CardTitle>Erro na procura do CEP</CardTitle>
          </CardHeader>
          <CardBody>
            <CardSubtitle>
              Tente novamente mais tarde.
            </CardSubtitle>
            <CardText>
              Erro para programadores: {erro}
            </CardText>
          </CardBody>
        </Card>
    {/await}
  {/if}

</Container>