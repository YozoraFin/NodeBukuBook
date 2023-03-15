import React, { Fragment } from 'react'
import Skeleton from 'react-loading-skeleton'

export default function SkeletonChat({jumlah}) {
    return (
        <Fragment>
            {Array(jumlah).fill(1).map((card, index) => (
                <li className="clearfix" key={`chatloading${index}`}>
                    <div className="row">
                        <div className="col-3">
                            <Skeleton className='imgskeleton' />
                        </div>
                        <div className="col-9">
                            <div className="about">
                                <Skeleton className='name pb-2' width={150} />
                                <Skeleton className='status' />
                            </div>
                        </div>
                    </div>
                </li>
            ))}
        </Fragment>
    )
}
