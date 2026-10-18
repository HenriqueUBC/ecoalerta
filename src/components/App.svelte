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
    CardSubtitle,
    Modal,
    CardFooter} from '@sveltestrap/sveltestrap'
  import { consultarCep, isCepValido, isErroInfoCep, isInfoCep, type ErroInfoCep, type InfoCep } from '../lib/viacep';
    import DenunciaForm from './DenunciaForm.svelte';
    import { buscarDenuncias } from '../lib/supabasecalls';
    import Denuncias from './Denuncias.svelte';

  let inputCep : string = $state("")
  let ultimoCep : string = $state("")
  let cepVerificado : boolean = $state(false)
  let currentCep : InfoCep | ErroInfoCep | undefined = $state(undefined)

  let abrirFormsDeDenuncia : boolean = $state(false)

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

  function infoCepToMapsURL(infoCep : InfoCep) : string {
    const queryMaps = encodeURIComponent(`${infoCep.logradouro}, ${infoCep.bairro}, ${infoCep.localidade}`);
    return `https://www.google.com/maps/search/?api=1&query=${queryMaps}`
  }

  function toggleFormsDenuncia() : void {
    abrirFormsDeDenuncia = !abrirFormsDeDenuncia
  }

  // isso é para manter o resultado da variavel fora do scopo
  // do bloco await;
  async function cepCall(cep : string) {
    currentCep = await consultarCep(cep)
    return currentCep
  }

</script>

<Styles />

<Container sm class="p-3">

  <Card>
    <CardHeader>
      <CardTitle>Pesquisar CEP:</CardTitle>
    </CardHeader>
    <CardBody>
        <Form on:submit={(e) => cepSubmit(e)}>
          <FormGroup floating label="Digite seu CPF Aqui">
            <Input required maxlength={8} pattern="[0-9.]*" bind:value={inputCep}></Input>
            <br>
            <Button type="submit" color="primary">Procurar Denuncias...</Button>
          </FormGroup>
        </Form>
    </CardBody>
  </Card>

  <br>

  {#if cepVerificado}
    {#await cepCall(ultimoCep)}
      <Spinner color="secondary"></Spinner>
      <p>Carregando informações do CEP...</p>
    {:then ic} 
      {#if isInfoCep(ic)}
        <Card>
          <CardHeader>
            <CardTitle>Informações do CEP:</CardTitle>
          </CardHeader>
          <CardBody>
            <CardText>
              <b>Rua:</b> {ic.logradouro} <br>
              <b>Bairro:</b> {ic.bairro} <br>
              <b>Cidade:</b> {ic.localidade} <br>
              <b>Estado:</b> {ic.estado} <br>
              <a href={infoCepToMapsURL(ic)} target="_blank">Link da localidade no Google Maps</a>
            </CardText>
          </CardBody>
          <CardFooter>
            <Button color="primary" on:click={toggleFormsDenuncia}>
              Postar nova denuncia a este CEP
            </Button>
          </CardFooter>
        </Card>
        <br>
        {#await buscarDenuncias(ic)}
          <Spinner color="secondary"></Spinner>
          <p>Procurando Denuncias...</p>
        {:then resDenuncias} 
          {#if resDenuncias.denuncias.length === 0}
            <p>Nenhuma denuncia foi encontrado nesse endereço, seja o primeiro a reportar!</p>
          {:else}
            <Denuncias denuncias={resDenuncias.denuncias}></Denuncias>
          {/if}
        {/await}
        <Modal isOpen={abrirFormsDeDenuncia} toggle={toggleFormsDenuncia}>
          <DenunciaForm cep={ultimoCep}></DenunciaForm>
        </Modal>
      {/if}
      {#if isErroInfoCep(ic)}
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