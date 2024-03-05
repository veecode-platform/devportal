import { Tip } from '@dweber019/backstage-plugin-tips';
import React from 'react';

export const platformTips: Tip[] = [
    {
        title: "teste devportal tip",
        content: (
            <div>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ?si=5TvyQsYhJ4bJKmB2" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
            </div>

        ),
        activate: ({ entity }) =>
            !!entity && true
    }

]