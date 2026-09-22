/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head />
    <Preview>Seu código de verificação da loja do Senhor do Bonfim</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Senhor do Bonfim · Marketplace Oficial</Text>
        <Heading style={h1}>Confirme sua identidade</Heading>
        <Text style={text}>Use o código abaixo para confirmar sua identidade:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={footer}>
          Este código expira em pouco tempo. Se você não fez esta solicitação,
          pode ignorar este e-mail com segurança.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, Helvetica, sans-serif' }
const container = { maxWidth: '560px', padding: '36px 28px' }
const brand = {
  color: '#C5911A',
  fontSize: '12px',
  fontWeight: 'bold' as const,
  letterSpacing: '1px',
  margin: '0 0 18px',
  textTransform: 'uppercase' as const,
}
const h1 = {
  fontFamily: 'Georgia, Times New Roman, serif',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#192842',
  margin: '0 0 20px',
}
const text = {
  fontSize: '14px',
  color: '#667085',
  lineHeight: '1.5',
  margin: '0 0 25px',
}
const codeStyle = {
  fontFamily: 'Courier, monospace',
  fontFamily: 'Georgia, Times New Roman, serif',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: '#192842',
  margin: '0 0 30px',
}
const footer = { fontSize: '12px', color: '#8A8F98', lineHeight: '1.5', margin: '30px 0 0' }
