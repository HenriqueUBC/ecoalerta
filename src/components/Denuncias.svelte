<script lang="ts">

import { Container, Row, Col, Card, Image } from "@sveltestrap/sveltestrap"
import { type Denuncia } from "../lib/supabasecalls";

export let denuncias : Denuncia[]

function timestampToBRInfo(ts : string) : string {
    let dt = new Date(ts)
    return `${dt.getDay()}/${dt.getMonth()}/${dt.getFullYear()}`
}

</script>

<Container sm>
    <Row cols={{lg: 3, md: 2, sm: 1}}>
        {#each denuncias as denuncia}
            <Col>
                <Card body>
                    <Image fluid src={denuncia.foto_url}></Image>
                    <p>{denuncia.descricao}</p>
                    <p>Registrado no dia: {timestampToBRInfo(denuncia.created_at)}</p>
                </Card>
            </Col>
        {/each}
    </Row>
</Container>