/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface MagicLinkEmailProps {
  siteName: string
  confirmationUrl: string
}

export const MagicLinkEmail = ({
  siteName,
  confirmationUrl,
}: MagicLinkEmailProps) => (
  <Html lang="pt-BR" dir="ltr">
    <Head>
      <style>{darkModeCss}</style>
    </Head>
    <Preview>Seu link de acesso à loja do Senhor do Bonfim</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>Senhor do Bonfim · Marketplace Oficial</Text>
        <Heading style={h1}>Seu link de acesso</Heading>
        <Text style={text}>
          Use o botão abaixo para entrar em {siteName}. Este link expira em
          pouco tempo.
        </Text>
        <Button className="dm-btn" style={button} href={confirmationUrl}>
          Entrar
        </Button>
        <Text style={footer}>
          Se você não solicitou este link, pode ignorar este e-mail com segurança.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default MagicLinkEmail

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
const button = {
  backgroundColor: '#192842',
  color: '#ffffff',
  fontSize: '14px',
  border: '1px solid #192842',
  borderRadius: '8px',
  padding: '12px 20px',
  textDecoration: 'none',
}
const footer = { fontSize: '12px', color: '#8A8F98', lineHeight: '1.5', margin: '30px 0 0' }
// Rendered as a text child, which React may HTML-escape: keep this CSS free of >, &, and quotes.
const darkModeCss = `
  @media (prefers-color-scheme: dark) {
    .dm-btn { background-color: #192842 !important; color: #ffffff !important; }
  }
  [data-ogsc] .dm-btn { background-color: #192842 !important; color: #ffffff !important; }
  [data-ogsb] .dm-btn { background-color: #192842 !important; color: #ffffff !important; }
`
