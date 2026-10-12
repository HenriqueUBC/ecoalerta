<script lang="ts">
  import { Styles, Container, Input, Form, FormGroup, Button } from '@sveltestrap/sveltestrap'

  let inputCpf : string = $state("")
</script>

<Styles />

<Container sm>
  <Form>
    <FormGroup floating label="Digite seu CPF Aqui">
      <Input required maxlength=8 bind:value={inputCpf}></Input>
    </FormGroup>
    {#if inputCpf}
      <p>{inputCpf}</p>
    {/if}
  </Form>
</Container>