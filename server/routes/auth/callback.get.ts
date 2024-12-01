import { z } from 'zod'
import jwt, { type JwtPayload } from 'jsonwebtoken'
import { GithubOAuthResponse } from '~/types/github'

export default defineEventHandler(async event => {
  // Implement the redirect_uri callback function
})