import React from 'react'
import ImageForm from '@/app/components/ImageForm'
import { connectOpenAi } from '../_actions/images';

async function NewImage() {
  return (
    <ImageForm/>
  )
}

export default NewImage; 