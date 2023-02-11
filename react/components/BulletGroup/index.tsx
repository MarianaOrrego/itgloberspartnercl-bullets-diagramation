import React, { PropsWithChildren } from 'react';
import { BulletsSchema } from './BulletTypes';
import { getBulletsAsTSXList } from './modules/bulletsAsList';
import { useDevice } from 'vtex.device-detector';
import { useListContext } from 'vtex.list-context';

export interface BulletGroupProps {
    bullets: BulletsSchema
}

const BulletGroup = ({
    bullets,
    children
}: PropsWithChildren<BulletGroupProps>) => {
    const { isMobile } = useDevice();
    const { list } = useListContext() || []

    console.log("Bullets", bullets)

    const bulletsGroup = getBulletsAsTSXList(bullets);

    if (false) {
        console.log(children, list)
    }

    return (
        isMobile
            ?
            <div>Estamos en mobile</div>
            :
            <div>{bulletsGroup}</div>
    )
}

export default BulletGroup;