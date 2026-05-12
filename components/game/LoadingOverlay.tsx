'use client'

import { AnimatePresence, motion } from 'framer-motion'

import { Flame, LoaderCircle } from 'lucide-react'

interface LoadingOverlayProps {
  show: boolean

  message?: string
}

export function LoadingOverlay({ show, message = 'The abyss answers...' }: LoadingOverlayProps) {
  return (
    <AnimatePresence initial={false}>
      {show && (
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          exit={{
            opacity: 0,
          }}
          transition={{
            duration: 0.45,
          }}
          className="
fixed
left-0
top-0
z-[9999]
h-screen
w-screen
pointer-events-auto
overflow-hidden
bg-black/92
backdrop-blur-md
"
        >
          <motion.div
            initial={{
              opacity: 0,
              scale: 1.05,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
            }}
            transition={{
              duration: 0.7,
              ease: 'easeOut',
            }}
            className="
              absolute
              inset-0

              bg-[radial-gradient(circle_at_center,rgba(120,20,20,0.12),transparent_60%)]
            "
          />

          <div className="flex h-screen w-screen items-center justify-center px-6">
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: 10,
              }}
              transition={{
                delay: 0.1,
                duration: 0.6,
              }}
              className="
                relative

                w-full
                max-w-[420px]

                overflow-hidden

                border
                border-[#2b2320]

                bg-[#090606]/95

                px-10
                py-12

                text-center

                shadow-[0_0_60px_rgba(0,0,0,0.7)]
              "
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#8e1f1f] to-transparent" />

              <motion.div
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.06, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: 'easeInOut',
                }}
                className="mx-auto mb-6 flex justify-center"
              >
                <div className="relative">
                  <Flame className="h-10 w-10 text-[#9f2e2e]" />

                  <LoaderCircle className="absolute -inset-3 h-16 w-16 animate-spin text-[#5a1d1d]/50" />
                </div>
              </motion.div>

              <div className="text-[10px] uppercase tracking-[0.55em] text-[#6f6259]">
                Descent Continues
              </div>

              <div className="mt-5 font-cinzel text-2xl uppercase tracking-[0.08em] text-[#efe4da]">
                {message}
              </div>

              <motion.div
                animate={{
                  opacity: [0.2, 1, 0.2],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.5,
                }}
                className="mt-6 text-sm text-[#8f8176]"
              >
                The bells answer below...
              </motion.div>

              <motion.div
                initial={{
                  scaleX: 0,
                }}
                animate={{
                  scaleX: 1,
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                }}
                className="
                  mt-8
                  h-px
                  origin-left

                  bg-gradient-to-r
                  from-[#8e1f1f]
                  to-transparent
                "
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
