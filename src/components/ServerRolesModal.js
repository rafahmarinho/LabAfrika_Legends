import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

export function ServerRolesModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} variant={"link"}>
        Regras e punições!
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        isCentered
        size={"xl"}
      >
        <ModalOverlay />
        <ModalContent rounded={"sm"} bg={"whitesmoke"}>
          <ModalHeader>REGRAS DO SERVIDOR</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div class="body">
              <b>Legends Of Unknown</b> é um MMORPG desenvolvido em conjunto com
              os jogadores, onde todos os dias novos e antigos jogadores
              encontram desafios jamais vistos no mundo Pokémon. Para que este
              jogo se mantenha divertido e justo para todos, apontamos algumas
              políticas em nossa comunidade, as quais restringem atitudes
              destrutivas no jogo ou no website oficial, penalisando, banindo ou
              deletando personagens e contas. Desta forma, consideramos as
              seguintes ações proibidas:
              <br />
              <br />
              <b>1. Nomes</b>
              <br />
              <b>a)</b> Nomes com insultos, racistas, de cunho sexual,
              relacionados à drogas ou censuráveis de alguma forma.
              <br />
              <b>b)</b> Nomes contendo trechos de frases, palavras mal
              formatadas ou combinações de letra sem sentido.
              <br />
              <b>c)</b> Nomes que expressam opiniões políticas ou religiosas,
              que contenham propaganda ilegal ou que de maneira geral não se
              encaixam na temática de fantasia medieval do{" "}
              <b>Legends Of Unknown</b>.<br />
              <b>d)</b> Nomes que implicam ou incitam violação das Regras do{" "}
              <b>Legends Of Unknown</b>.<br />
              <b>e)</b> Nomes que citem membros da equipe ou que tentam se
              passar pelos mesmos.
              <br />
              <b>f)</b> Nomes que causam spam no game, é motivo de namelock !.
              <br />
              <br />
              <br />
              <b>2. Declarações e Mensagens</b>
              <br />
              <b>a)</b> Insultos, racismo, de cunho sexual, relacionadas à
              drogas, embaraçosas ou censuráveis de alguma forma, principalmente
              no Help Channel.
              <br />
              <b>b)</b> Não é permitido o envio de mensagens iguais(spam) em
              chat públicos, tal como Help Channel.
              <br />
              <b>c)</b> Não é permitido o anúncio de outros servidores, sites,
              outros jogos ou qualquer coisa que não seja relacionado ao{" "}
              <b>Legends Of Unknown</b>.<br />
              <b>d)</b> Declarações que citem ou estimulem a violação das regras
              do servidor.
              <br />
              <b>e)</b> Utilização indevida dos Canais Públicos (Game-chat para
              conversar, Trade para negociar e Help para dúvidas).
              <br />
              <br />
              <br />
              <b>3. Trapaças e Abuso de Bug</b>
              <br />
              <b>a)</b> Explorar qualquer erro do jogo para beneficio próprio ou
              de terceiros. Caso encontre qualquer erro, ele deve ser reportado
              imediatamente.
              <br />
              <b>b)</b> Abusar intencionalmente de fraquezas do jogo.
              <br />
              <b>c)</b> Tentativa ou roubo dos dados de uma conta pertencente a
              outro jogador.
              <br />
              <b>d)</b> Não é permitido fazer qualquer tipo de barreira(trap)
              para não permitir a passagem de quem quer caçar dentro de qualquer
              cidade ou saída/entrada de áreas de caça.
              <br />
              <b>e)</b> Não é permitido jogar itens de forma demasiada no mesmo
              SQM com a intenção de roubar alguém ou até mesmo causar debug no
              cliente do outro jogador.
              <br />
              <b>f)</b> Utilizar ou se aproveitar de Bugs para matar, upar,
              roubar, ou qualquer eventualidade no servidor.
              <br />
              <br />
              <br />
              <b>4. Equipe e Colaboradores</b>
              <br />
              <b>a)</b> Ameaçar ou ofender um membro da equipe ou colaborador em
              resposta a suas ações como tal em sua função.
              <br />
              <b>b)</b> Fingir ser um gamemaster ou tentar influenciar suas
              decisões.
              <br />
              <b>c)</b> Fornecer intencionalmente informações erradas ou
              enganadoras para um gamemaster durante suas investigações, ou
              fazer falsas denúncias sobre supostas violações das Regras.
              <br />
              <b>d)</b> Não é permitido insultar a qualquer membro de nossa
              equipe ou colaboradores, tanto em chats públicos como em chats
              privados.
              <br />
              <br />
              <br />
              <b>5. Servidor</b>
              <br />
              <b>a)</b> Tudo o que for relacionado a jogabilidade, membros da
              equipe não interferem.
              <br />
              <b>b)</b> Qualquer tipo de desrespeito em relação donates/adm é
              motivo de delete e perca de bens.
              <br />
              <b>c)</b> As accounts são de propriedade do{" "}
              <b>Legends Of Unknown</b>, porém os jogadores são responsáveis
              pelas mesmas, toda e qualquer atitude que viole as regras ou o
              código penal, sofrerá as devidas sanções e penalidades.
              <br />
              <b>d)</b> É proibida a troca de itens em outros servidores.
              <br />
              <b>e)</b> Citar o nome de qualquer outro servidor poderá resultar
              em banimento.
              <br />
              <b>f)</b> Qualquer atitude que não esteja citada nas regras acima,
              mas que seja analisada e considerada prejudicial ao jogo por
              qualquer membro da equipe <b>Legends Of Unknown</b> poderá
              acarretar nas devidas medidas cabíveis, inclusive irriversíveis.
              <br />
              <b>g)</b> A <b>Legends Of Unknown</b> se reserva no direito de
              remover contas e personagens inativos ou que não acessam o jogo
              por um tempo igual ou superior a 100 dias.
              <br />
              <b>h)</b> A <b>Legends Of Unknown</b> não garante total
              funcionalidade dos sistemas e de suas integrações. Perdas por
              parte do jogador poderão ocorrer, sempre que perceber
              instabilidade ou receber uma mensagem de alerta, mantenha seus
              itens e personagens em locais seguros.
              <br />
              <br />
              <br />
              <br />
              <center>
                <small>
                  As regras podem sofrer alterações sem aviso prévio.
                  <br />
                  Leia sempre que possível.
                </small>
              </center>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
