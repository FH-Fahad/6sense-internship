import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class Dev {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true })
    skills: string;

    @Prop({ required: true })
    experience: string;
}

export const DevSchema = SchemaFactory.createForClass(Dev);
