import {MigrationInterface, QueryRunner} from "typeorm";

export class EventData1616359357051 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.events (machine_name)  
            VALUES ('miss'), ('hit'), ('empty'), ('ship')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM events
            WHERE 
            machine_name = 'miss'
            OR machine_name = 'hit'
            OR machine_name = 'empty'
            OR machine_name = 'ship'
        `);
    }
}
